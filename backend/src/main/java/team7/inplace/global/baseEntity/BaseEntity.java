package team7.inplace.global.baseEntity;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
public class BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;
    @Column
    @LastModifiedDate
    private LocalDateTime updateAt;

    private LocalDateTime deleteAt;

    public void deleteSoftly(LocalDateTime deleteAt){
        this.deleteAt = deleteAt;
    }

    public boolean isSoftDeleted() {
        return this.deleteAt == null;
    }

    public void undoDeletion() {
        this.deleteAt = null;
    }
}
