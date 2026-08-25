package com.healthcare.backend.repository;

import com.healthcare.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);

    List<Notification> findByRecipientEmailAndIsReadFalseOrderByCreatedAtDesc(String recipientEmail);

    List<Notification> findByType(String type);

    List<Notification> findByIsReadFalse();

    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}