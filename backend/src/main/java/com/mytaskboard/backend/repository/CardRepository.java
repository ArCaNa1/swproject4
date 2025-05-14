package com.mytaskboard.backend.repository;

import com.mytaskboard.backend.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; 

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {
    //List<Card> findByCreatedBy(Long createdBy);
}
