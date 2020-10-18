#!/usr/bin/env bash
while :
do
    clear
    (cd RASD; pdflatex -halt-on-error main.tex)
    if [ $? -eq 0 ]
    then
        echo $(cd RASD; zip cache Files/* 1>/dev/null; md5 cache.zip) > date.iml;
        rm ./RASD/cache.zip;
    fi
    sleep 5
done
