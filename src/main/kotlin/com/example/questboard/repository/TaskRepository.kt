package com.example.questboard.repository
import com.example.questboard.model.Task
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository

@Repository
interface TaskRepository : CrudRepository<Task, Long>{
    //Allows automatic searching by ID
}
