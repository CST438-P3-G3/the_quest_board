package com.example.repository
import com.example.model.Task
import org.springframework.stereotype.Repository
import org.springframework.data.repository.CrudRepository
import java.util.UUID

@Repository
interface TaskRepository : CrudRepository<Task, UUID>{
    //Allows automatic searching by ID
    fun findAllByHouseholdId(householdId: UUID) : List<Task>
}
