package com.example.demo.jwt;

import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

@Service
public class JwtUtil {
    private final UserService userService;
    @Autowired
    public JwtUtil(UserService userService){this.userService=userService;}

    private Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    //    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(User user) {
        Optional<User> usr = userService.getUser(user.getUserid());
        Map<String, Object> claims = new HashMap<>();
        claims.put("id",usr.get().getUid() );
        claims.put("role", usr.get().getRole());
        claims.put("userid", usr.get().getUserid());
        claims.put("username",usr.get().getUsername());
        claims.put("verify", usr.get().isVerified());
        claims.put("publickey", usr.get().getPublicKey());
        return createToken(claims);
    }
    public String generateSignUpToken(User user){
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", user.getUserid());
        claims.put("username",user.getUsername());
        claims.put("email",user.getEmail());
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder().setClaims(claims).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // token will expire after 10 hours
                .signWith(SignatureAlgorithm.HS256, secretKey).compact();
    }

}
