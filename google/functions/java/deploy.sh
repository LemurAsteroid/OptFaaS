# gcloud functions deploy java01 \
#    --gen2 \
#    --entry-point functions.HelloWorld \
#    --runtime=java17 \
#    --region=asia-northeast1 \
#    --source=. \
#    --trigger-http \
#    --allow-unauthenticated \
#    --memory=256Mi \
#    --max-instances=30

 gcloud functions deploy java01 \
    --gen2 \
    --entry-point functions.HelloWorld \
    --runtime=java17 \
    --region=europe-west3 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30

 gcloud functions deploy java01 \
    --gen2 \
    --entry-point functions.HelloWorld \
    --runtime=java17 \
    --region=us-central1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30


## function 02
 gcloud functions deploy java02 \
    --gen2 \
    --entry-point functions.ImageProcessingFunction \
    --runtime=java17 \
    --region=asia-northeast1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=512Mi \
    --max-instances=30

gcloud functions deploy java02 \
    --gen2 \
    --entry-point functions.ImageProcessingFunction \
    --runtime=java17 \
    --region=europe-west3 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=512Mi \
    --max-instances=30

gcloud functions deploy java02 \
    --gen2 \
    --entry-point functions.ImageProcessingFunction \
    --runtime=java17 \
    --region=us-central1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=512Mi \
    --max-instances=30


## function 03
 gcloud functions deploy java03 \
    --gen2 \
    --entry-point functions.GCFStorageBenchmark \
    --runtime=java17 \
    --region=asia-northeast1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30

 gcloud functions deploy java03 \
    --gen2 \
    --entry-point functions.GCFStorageBenchmark \
    --runtime=java17 \
    --region=europe-west3 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30

 gcloud functions deploy java03 \
    --gen2 \
    --entry-point functions.GCFStorageBenchmark \
    --runtime=java17 \
    --region=us-central1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30


## function 04
 gcloud functions deploy java04 \
    --gen2 \
    --entry-point functions.Fibonacci \
    --runtime=java17 \
    --region=asia-northeast1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30

 gcloud functions deploy java04 \
    --gen2 \
    --entry-point functions.Fibonacci \
    --runtime=java17 \
    --region=europe-west3 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30

 gcloud functions deploy java04 \
    --gen2 \
    --entry-point functions.Fibonacci \
    --runtime=java17 \
    --region=us-central1 \
    --source=. \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256Mi \
    --max-instances=30
