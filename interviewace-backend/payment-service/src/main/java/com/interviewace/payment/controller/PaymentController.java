package com.interviewace.payment.controller;

import com.interviewace.payment.model.Subscription;
import com.interviewace.payment.service.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
    
    private final PaymentService paymentService;
    
    @GetMapping("/subscription")
    public ResponseEntity<Subscription> getSubscription(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail) throws StripeException {
        
        return ResponseEntity.ok(paymentService.getOrCreateSubscription(userId, userEmail));
    }
    
    @PostMapping("/checkout")
    public ResponseEntity<Map<String, String>> createCheckoutSession(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, String> request) throws StripeException {
        
        String tier = request.get("tier");
        String successUrl = request.get("successUrl");
        String cancelUrl = request.get("cancelUrl");
        
        String checkoutUrl = paymentService.createCheckoutSession(userId, tier, successUrl, cancelUrl);
        return ResponseEntity.ok(Map.of("url", checkoutUrl));
    }
    
    @PostMapping("/cancel")
    public ResponseEntity<Map<String, String>> cancelSubscription(
            @RequestHeader("X-User-Id") Long userId) throws StripeException {
        
        paymentService.cancelSubscription(userId);
        return ResponseEntity.ok(Map.of("message", "Subscription canceled successfully"));
    }
    
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        // Webhook handling implementation
        // Verify signature and process events like subscription updates, payments, etc.
        return ResponseEntity.ok("Webhook received");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment Service is running!");
    }
}
