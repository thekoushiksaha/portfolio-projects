package com.koushik.outspend.auth.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.koushik.outspend.auth.entity.RefreshToken;

import jakarta.persistence.LockModeType;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM RefreshToken t WHERE t.token = :token")
    Optional<RefreshToken> findByToken(@Param("token") String token);

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate < :now")
    int deleteExpired(@Param("now") Instant now);
}
