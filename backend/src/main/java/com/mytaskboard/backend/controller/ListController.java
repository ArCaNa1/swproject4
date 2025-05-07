package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.ListEntity;
import com.mytaskboard.backend.repository.ListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ListController {

    @Autowired
    private ListRepository listRepository;

    // 리스트 전체 조회 (사용자 이메일 기준)
    @GetMapping("/{email}")
    public ResponseEntity<List<ListEntity>> getUserLists(@PathVariable String email) {
        return ResponseEntity.ok(listRepository.findByEmail(email));
    }

    // 리스트 생성
    @PostMapping
    public ResponseEntity<ListEntity> createList(@RequestBody ListEntity list) {
        return ResponseEntity.ok(listRepository.save(list));
    }

    // 리스트 제목 수정
    @PutMapping("/{id}")
    public ResponseEntity<ListEntity> updateList(@PathVariable int id, @RequestBody ListEntity updated) {
        return listRepository.findById(id)
                .map(list -> {
                    list.setTitle(updated.getTitle());
                    return ResponseEntity.ok(listRepository.save(list));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 리스트 삭제 (선택사항)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteList(@PathVariable int id) {
        listRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
