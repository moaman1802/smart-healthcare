package com.healthcare.backend.service;

import com.healthcare.backend.entity.Appointment;
import com.healthcare.backend.entity.AppointmentStatus;
import com.healthcare.backend.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 1. Book appointment
    public Appointment bookAppointment(Appointment appointment) {
        // Check if slot is already booked
        boolean slotBooked = appointmentRepository.existsByDoctorEmailAndAppointmentDateAndAppointmentTime(
                appointment.getDoctorEmail(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime()
        );

        if (slotBooked) {
            throw new RuntimeException("This time slot is already booked for the doctor.");
        }

        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    // 2. Get all appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // 3. Get appointment by ID
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // 4. Get appointments by patient email
    public List<Appointment> getAppointmentsByPatient(String patientEmail) {
        return appointmentRepository.findByPatientEmail(patientEmail);
    }

    // 5. Get appointments by doctor email
    public List<Appointment> getAppointmentsByDoctor(String doctorEmail) {
        return appointmentRepository.findByDoctorEmail(doctorEmail);
    }

    // 6. Get appointments by status
    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    // 7. Update appointment status
    public Appointment updateStatus(Long id, AppointmentStatus status) {
        return appointmentRepository.findById(id).map(appointment -> {
            appointment.setStatus(status);
            return appointmentRepository.save(appointment);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
    }

    // 8. Cancel appointment
    public Appointment cancelAppointment(Long id) {
        return updateStatus(id, AppointmentStatus.CANCELLED);
    }

    // 9. Confirm appointment (Doctor/Admin)
    public Appointment confirmAppointment(Long id) {
        return updateStatus(id, AppointmentStatus.CONFIRMED);
    }

    // 10. Complete appointment (Doctor)
    public Appointment completeAppointment(Long id) {
        return updateStatus(id, AppointmentStatus.COMPLETED);
    }

    // 11. Delete appointment
    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    // 12. Check doctor availability for a specific date and time
    public boolean isSlotAvailable(String doctorEmail, LocalDate date, LocalTime time) {
        return !appointmentRepository.existsByDoctorEmailAndAppointmentDateAndAppointmentTime(
                doctorEmail, date, time
        );
    }
}