package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Integer> {

    @Query("SELECT usr FROM User usr WHERE usr.userid=:userid")
    Optional<User> findByUserId(@Param("userid") String userId);

    @Query("SELECT u.userid FROM User u WHERE u.userid LIKE %:searchTerm%")
    List<String> searchUsersByUserIdLike(@Param("searchTerm") String searchTerm);
}
