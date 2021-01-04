#!/usr/bin/env bash
DOC=RASD
VERSION=2
while :
do
    clear
    (cd ${DOC}; pdflatex -halt-on-error main.tex; bibtex main; pdflatex -halt-on-error main.tex;pdflatex -halt-on-error main.tex)
    if [ $? -eq 0 ]
    then
        mv ${DOC}/main.pdf DeliveryFolder/${DOC}${VERSION}.pdf
    fi
    sleep 5
done
