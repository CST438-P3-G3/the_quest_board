package com.example.questboard.repository

import com.example.questboard.model.TaskCompletion
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface TaskCompletionRepository : CrudRepository<TaskCompletion, Long> {
    //Allows for automatic searching via ID.
}