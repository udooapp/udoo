package com.udoo.dal.repositories;

import com.udoo.dal.entities.Token;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 */
public interface ITokenRepository extends Repository<Token, Integer> {

    List<Token> findByUid(int uid);

    Token save(Token token);

    Token getByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM Token t WHERE t.uid= :uid  ")
    int deleteByUid(@Param("uid") int uid);

}
