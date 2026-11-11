package com.example.questboard.repository

import com.example.questboard.model.TaskCompletion
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TaskCompletionRepository : CrudRepository<TaskCompletion, UUID> {
    //Allows for automatic searching via ID.
    fun findAllByTaskIdIn(taskIds: Collection<UUID>): List<TaskCompletion>
}