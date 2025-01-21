package com.lambda.api.Entities;

import com.lambda.api.Dtos.AboutRequestDTO;
import jakarta.persistence.*;
import java.util.Objects;

@Entity
public class About {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String about;
    @Version
    private Long version;

    public About(){}

    public About(String title, String about){
        this.title = title;
        this.about = about;
    }

    public static About create(AboutRequestDTO request){

        return new About(request.title(), request.aboutText());
    }

    public void updateAbout(AboutRequestDTO request){
        this.title = request.title();
        this.about = request.aboutText();
    }

    public Long getId() {
        return id;
    }

    public String getAbout() {
        return about;
    }

    public String getTitle() {
        return title;
    }

    @Override
    public String toString() {
        return "About{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", about='" + about + '\'' +
                ", version=" + version +
                '}';
    }


}
