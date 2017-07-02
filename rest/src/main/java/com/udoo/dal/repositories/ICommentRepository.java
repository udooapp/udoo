package com.udoo.dal.repositories;

import com.udoo.dal.entities.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.Repository;

import java.util.List;


/**
 */
public interface ICommentRepository extends Repository<Comment, Integer> {

    List<Comment> findAll();

    Comment save(Comment comment);


    List<Comment> findAllBySidAndType(long sid, boolean type, Pageable page);
}
