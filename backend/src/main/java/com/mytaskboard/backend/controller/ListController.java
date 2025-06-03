package com.mytaskboard.backend.controller;

import com.mytaskboard.backend.entity.ListEntity;
import com.mytaskboard.backend.repository.ListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ListController {

    @Autowired
    private ListRepository listRepository;

    // 특정 사용자 이메일 기준 전체 리스트 조회
    @GetMapping("/{email}")
    public ResponseEntity<List<ListEntity>> getUserLists(@PathVariable String email) {
        List<ListEntity> lists = listRepository.findByEmail(email);
        return ResponseEntity.ok(lists);
    }

    // 팀 ID 기준 전체 리스트 조회
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<ListEntity>> getListsByTeam(@PathVariable Long teamId) {
        List<ListEntity> lists = listRepository.findByTeamId(teamId);
        return ResponseEntity.ok(lists);
    }

    // 리스트 생성
    @PostMapping
    public ResponseEntity<ListEntity> createList(@RequestBody ListEntity list) {
        try {
            ListEntity saved = listRepository.save(list);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    // 리스트 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteList(@PathVariable Integer id) {
        try {
            listRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("삭제 실패");
        }
    }
}
