package com.example.demo.repositories;

import com.example.demo.model.entities.LineNumber;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LineNumberRepository extends CrudRepository<LineNumber, Integer> {

    List<LineNumber> findAll();

    @Query(value = "select count(ln) from LineNumber ln where ln.store.id = :storeId and status= 'VISITING'")
    int monitor(@Param("storeId")int storeId);

    @Query(value = "select count(ln) from LineNumber ln where ln.store.id = :storeId and :time between ln.from and ln.until")
    int overLapsAt(@Param("storeId")int storeId, @Param("time") long time);
}
