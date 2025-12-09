pd run -it --rm --net=host --entrypoint=//bin/sh minio/mc

mc alias set mi-minio http://localhost:9000 root password123
mc anonymous set download mi-minio/saas-bucket
exit