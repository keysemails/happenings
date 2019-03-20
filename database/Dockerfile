FROM postgres:11.2

RUN apt-get update && apt-get install -y \
	build-essential \
	&& apt-get clean -y && apt-get autoremove -y

ADD . /src
WORKDIR /src/
RUN chmod -R 777 /src/

ADD ./sql/init.sql /docker-entrypoint-initdb.d/
