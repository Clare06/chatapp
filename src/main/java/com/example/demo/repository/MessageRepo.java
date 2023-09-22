package com.example.demo.repository;
import com.example.demo.entity.Message;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepo extends JpaRepository<Message, Integer> {

    @Query("SELECT m FROM Message m WHERE m.sender = :user OR m.receiver = :user ORDER BY m.timestamp ASC")
    List<Message> findAllBySenderOrReceiverOrderByTimestampAsc(User user);


}

