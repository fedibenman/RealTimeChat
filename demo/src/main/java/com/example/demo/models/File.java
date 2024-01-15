package com.example.demo.models;

import lombok.Data;


import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    private byte[] data;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "message_id")
    private Message message;
}
