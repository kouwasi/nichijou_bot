# Stage 0
FROM ubuntu

WORKDIR /tmp

RUN apt-get update && \
    apt-get -q -y install mecab libmecab-dev mecab-ipadic-utf8 git make curl xz-utils file 

RUN git clone --depth 1 https://github.com/neologd/mecab-ipadic-neologd.git

WORKDIR /tmp/mecab-ipadic-neologd

RUN mkdir -p /opt/mecab-ipadic-neologd && \
    yes yes | ./bin/install-mecab-ipadic-neologd -n -p /opt/mecab-ipadic-neologd


# Stage 1
FROM node:12

ENV WORKDIR /app
RUN mkdir -p ${WORKDIR}
WORKDIR ${WORKDIR}

RUN apt-get update && apt-get install -q -y mecab

COPY --from=0 /opt/mecab-ipadic-neologd /opt/mecab-ipadic-neologd
COPY . ${WORKDIR}

RUN npm ci

CMD node app/index.js