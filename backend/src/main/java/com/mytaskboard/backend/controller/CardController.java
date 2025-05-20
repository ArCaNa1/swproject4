// src/main/java/com/mytaskboard/backend/controller/CardController.java
package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.Card; // ✅ 수정됨
import com.mytaskboard.backend.repository.CardRepository; // ✅ 수정됨
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardRepository cardRepository;

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
    public void deleteCard(@PathVariable Long id) {
        cardRepository.deleteById(id);
    }
}
