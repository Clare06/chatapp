package com.example.demo.repository;

import com.example.demo.model.User;
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

    @Query("SELECT u FROM User u WHERE u.email LIKE %:searchTerm% OR u.username LIKE %:searchTerm%")
    List<User> searchUsersByEmailOrNameLike(@Param("searchTerm") String searchTerm);

    @Query("SELECT u from User u WHERE u.email=:email")
    Optional<User> findUserByEmail(@Param("email") String email);
    @Query("SELECT usr FROM User usr WHERE usr.tempToken=:token")
    Optional<User> findByToken(@Param("token") String token);
}
