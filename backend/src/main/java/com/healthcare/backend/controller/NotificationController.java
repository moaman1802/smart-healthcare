package com.healthcare.backend.controller;

import com.healthcare.backend.entity.Notification;
import com.healthcare.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Get all notifications for a user
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Notification>> getNotifications(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(email));
    }

    // Get unread notifications for a user
    @GetMapping("/user/{email}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String email) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(email));
    }

    // Get unread count for a user
    @GetMapping("/user/{email}/count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable String email) {
        long count = notificationService.getUnreadCount(email);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    // Mark a single notification as read
    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    // Mark all notifications as read for a user
    @PatchMapping("/user/{email}/read-all")
    public ResponseEntity<?> markAllAsRead(@PathVariable String email) {
        notificationService.markAllAsRead(email);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    // Delete a notification
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification deleted"));
    }

    // Delete all notifications for a user
    @DeleteMapping("/user/{email}")
    public ResponseEntity<?> deleteAllForUser(@PathVariable String email) {
        notificationService.deleteAllForUser(email);
        return ResponseEntity.ok(Map.of("message", "All notifications deleted"));
    }

    // Admin: Create announcement for all users
    @PostMapping("/admin/announcement")
    public ResponseEntity<?> createAnnouncement(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String title = request.get("title");
        String message = request.get("message");
        
        if (email == null || email.trim().isEmpty() || title == null || title.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and title are required"));
        }
        
        Notification notification = notificationService.createAnnouncement(email, title, message);
        return ResponseEntity.ok(notification);
    }
}