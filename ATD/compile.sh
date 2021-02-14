#!/usr/bin/env bash

(cd document; pdflatex -halt-on-error main.tex; pdflatex -halt-on-error main.tex; cd ..)
if [ $? -eq 0 ]
then
    mv document/main.pdf ../DeliveryFolder/ATD1.pdf
fi
