// TaskController.java
package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Task;
import com.mytaskboard.backend.entity.User;
import com.mytaskboard.backend.repository.TaskRepository;
import com.mytaskboard.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String title = data.get("title");
        String status = data.get("status");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        Task task = new Task();
        task.setTitle(title);
        task.setStatus(status);
        task.setUser(user);
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getTasks(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("User not found");

        List<Task> tasks = taskRepository.findByUser(user);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Integer id, @RequestBody Task updatedTask) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.status(404).body("Task not found");

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setStatus(updatedTask.getStatus());
        task.setDueDate(updatedTask.getDueDate());
        taskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.status(404).body("Task not found");

        taskRepository.delete(task);
        return ResponseEntity.ok("Deleted");
    }
}
