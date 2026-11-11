package com.example.questboard.repository

import com.example.questboard.model.Task
import com.example.questboard.model.User
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository
import java.util.UUID

@Repository
interface UserRepository : CrudRepository<User, UUID>{
    //Allows automatic searching by ID
}