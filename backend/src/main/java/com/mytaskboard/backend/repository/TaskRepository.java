// TaskRepository.java
package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.Task;
import com.mytaskboard.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByUser(User user);
}
