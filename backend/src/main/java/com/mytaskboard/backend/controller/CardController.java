// src/main/java/com/mytaskboard/backend/controller/CardController.java
package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Card;
import com.mytaskboard.backend.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.mytaskboard.backend.repository.CommentRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @PostMapping
    public Card createCard(@RequestBody Card card) {
        return cardRepository.save(card);
    }

    @GetMapping
    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Card> getCardById(@PathVariable Long id) {
        return cardRepository.findById(id);
    }

    @PutMapping("/{id}")
    public Card updateCard(@PathVariable Long id, @RequestBody Card cardDetails) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Card not found with id " + id));

        card.setTitle(cardDetails.getTitle());
        card.setDescription(cardDetails.getDescription());
        card.setDueDate(cardDetails.getDueDate());
        card.setStatus(cardDetails.getStatus());
        card.setListId(cardDetails.getListId());
        card.setPosition(cardDetails.getPosition());
        return cardRepository.save(card);
    }


    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCard(@PathVariable Long id) {
        try {
            System.out.println("🧨 삭제 시도 카드 ID: " + id);

            commentRepository.deleteByCardId(id);

            cardRepository.deleteById(id);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패: " + e.getMessage());
        }
    }

}
