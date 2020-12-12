#!/usr/bin/env bash
DOC=RASD
VERSION=1
while :
do
    clear
    (cd ${DOC}; pdflatex -halt-on-error main.tex)
    if [ $? -eq 0 ]
    then
        mv ${DOC}/main.pdf DeliveryFolder/${DOC}${VERSION}.pdf
        echo $(cd ${DOC}; zip cache Files/* 1>/dev/null; md5 cache.zip) > date.iml;
        rm ./${DOC}/cache.zip;
    fi
    sleep 5
done
