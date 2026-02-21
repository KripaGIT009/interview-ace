package com.interviewlabpro.payment.service;

import com.interviewlabpro.payment.model.Subscription;
import com.interviewlabpro.payment.repository.SubscriptionRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final String LOCAL_STRIPE_CUSTOMER_PREFIX = "local_customer_";
    
    private final SubscriptionRepository subscriptionRepository;
    
    @Value("${stripe.prices.pro}")
    private String proPriceId;
    
    @Value("${stripe.prices.enterprise}")
    private String enterprisePriceId;

    @Value("${stripe.api.key:}")
    private String stripeApiKey;
    
    public Subscription getOrCreateSubscription(Long userId, String userEmail) throws StripeException {
        return subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> createFreeSubscription(userId, userEmail));
    }
    
    @Transactional
    public Subscription createFreeSubscription(Long userId, String userEmail) {
        if (!isStripeConfigured()) {
            Subscription subscription = new Subscription();
            subscription.setUserId(userId);
            subscription.setStripeCustomerId(buildLocalStripeCustomerId(userId));
            subscription.setTier(Subscription.SubscriptionTier.FREE);
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setCreatedAt(LocalDateTime.now());
            return subscriptionRepository.save(subscription);
        }

        try {
            // Create Stripe customer
            CustomerCreateParams params = CustomerCreateParams.builder()
                    .setEmail(userEmail)
                    .setMetadata(java.util.Map.of("userId", userId.toString()))
                    .build();
            
            Customer customer = Customer.create(params);
            
            Subscription subscription = new Subscription();
            subscription.setUserId(userId);
            subscription.setStripeCustomerId(customer.getId());
            subscription.setTier(Subscription.SubscriptionTier.FREE);
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
            subscription.setCreatedAt(LocalDateTime.now());
            
            return subscriptionRepository.save(subscription);
        } catch (StripeException e) {
            throw new RuntimeException("Failed to create Stripe customer", e);
        }
    }
    
    public String createCheckoutSession(Long userId, String userEmail, String tier, String successUrl, String cancelUrl) throws StripeException {
        if (!isStripeConfigured()) {
            throw new RuntimeException("Stripe is not configured. Please set STRIPE_SECRET_KEY.");
        }

        Subscription subscription = getOrCreateSubscription(userId, userEmail);

        if (subscription.getStripeCustomerId() == null
                || subscription.getStripeCustomerId().isBlank()
                || isLocalStripeCustomerId(subscription.getStripeCustomerId())) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setEmail(userEmail)
                    .setMetadata(java.util.Map.of("userId", userId.toString()))
                    .build();
            Customer customer = Customer.create(customerParams);
            subscription.setStripeCustomerId(customer.getId());
            subscription.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);
        }
        
        String priceId = tier.equalsIgnoreCase("PRO") ? proPriceId : enterprisePriceId;
        
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(subscription.getStripeCustomerId())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(priceId)
                                .setQuantity(1L)
                                .build()
                )
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .build();
        
        com.stripe.model.checkout.Session session = com.stripe.model.checkout.Session.create(params);
        return session.getUrl();
    }

    private boolean isStripeConfigured() {
        return stripeApiKey != null
                && !stripeApiKey.isBlank()
                && !stripeApiKey.equals("sk_test_your_stripe_secret_key");
    }

    private String buildLocalStripeCustomerId(Long userId) {
        return LOCAL_STRIPE_CUSTOMER_PREFIX + userId;
    }

    private boolean isLocalStripeCustomerId(String stripeCustomerId) {
        return stripeCustomerId != null && stripeCustomerId.startsWith(LOCAL_STRIPE_CUSTOMER_PREFIX);
    }
    
    @Transactional
    public Subscription updateSubscriptionTier(Long userId, Subscription.SubscriptionTier tier) {
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        subscription.setTier(tier);
        subscription.setUpdatedAt(LocalDateTime.now());
        
        return subscriptionRepository.save(subscription);
    }
    
    @Transactional
    public void cancelSubscription(Long userId) throws StripeException {
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        
        if (subscription.getStripeSubscriptionId() != null) {
            com.stripe.model.Subscription stripeSubscription = 
                    com.stripe.model.Subscription.retrieve(subscription.getStripeSubscriptionId());
            stripeSubscription.cancel();
        }
        
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELED);
        subscription.setTier(Subscription.SubscriptionTier.FREE);
        subscription.setUpdatedAt(LocalDateTime.now());
        
        subscriptionRepository.save(subscription);
    }
}
