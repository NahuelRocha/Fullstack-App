FROM public.ecr.aws/amazonlinux/amazonlinux:2023

RUN yum -y update \
    && yum install -y unzip tar gzip bzip2-devel ed gcc gcc-c++ gcc-gfortran \
    less libcurl-devel openssl openssl-devel readline-devel xz-devel \
    zlib-devel glibc-static zlib-static \
    && rm -rf /var/cache/yum

# Graal VM
ENV GRAAL_VERSION=23.0.1
ENV GRAAL_FILENAME=graalvm-community-jdk-${GRAAL_VERSION}_linux-x64_bin.tar.gz
RUN curl -4 -L https://github.com/graalvm/graalvm-ce-builds/releases/download/jdk-${GRAAL_VERSION}/${GRAAL_FILENAME} | tar -xvz
RUN mv graalvm-community-openjdk-${GRAAL_VERSION}* /usr/lib/graalvm
ENV JAVA_HOME=/usr/lib/graalvm

# Maven
ENV MVN_VERSION=3.9.9
ENV MVN_FOLDERNAME=apache-maven-${MVN_VERSION}
ENV MVN_FILENAME=apache-maven-${MVN_VERSION}-bin.tar.gz
RUN curl -4 -L https://archive.apache.org/dist/maven/maven-3/${MVN_VERSION}/binaries/${MVN_FILENAME} | tar -xvz
RUN mv $MVN_FOLDERNAME /usr/lib/maven
RUN ln -s /usr/lib/maven/bin/mvn /usr/bin/mvn

VOLUME /project
WORKDIR /project

WORKDIR /api