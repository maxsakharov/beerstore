### Beer store
This project was done with an intention to show how to deploy and monitor applications in Kubernetes

### Technology stack
* NodeJS+Express
* Kubernetes
* Grafana
* Prometheus

### Running locally

#### Pre requirements
To run locally you need to have
* [minikube](https://kubernetes.io/docs/getting-started-guides/minikube/)
* [docker](https://docs.docker.com/engine/installation/#platform-support-matrix)
* [kubectl](https://kubernetes.io/docs/user-guide/prereqs/)

#### System startup
* start docker engine
* start minikube by `minikube start`
* clone repo

You can use my test docker hub repo which is `maxsakharov03`, but in that case you won't be able push your changes there, so it's better to have and account on DockerHub where you can put you own images
But in order k8s to use your repo please replace all occurrence of `maxsakharov03` in files `k8s/beerfans.yml` and `k8s/beerstore.yml`

If you don't wanna use your own repo, then just skip next 2 steps

* build docker image for beerstore & push it to your repo

```
docker build -t beerstore -f beerstore/Dockerfile beerstore/
docker tag beerstore this-is-my-repo/beerstore:1.0.0
docker push this-is-my-repo/beerstore:1.0.0
```

* build docker image for beerfans & push it to your repo

```
docker build -t beerfans -f beerfans/Dockerfile beerfans/
docker tag beerfans this-is-my-repo/beerfans:1.0.0
docker push this-is-my-repo/beerfans:1.0.0
```

* deploy all of the components to minikube
```
kubectl create -f k8s/beerstore.yml
kubectl create -f k8s/beerfans.yml
kubectl create -f k8s/prometheus.yml
kubectl create -f k8s/grafana.yml
```

* go to minikube dashboard and check whether all of your components are healthy & running
```
minikube dashboard
```

* go to grafana dashboard and login with default credentials (login: admin, password: admin)
* add Prometheus datasource to grafana. Put output of next command as Prometheus URL
```
minikube service prometheus --url
```
Note: Leave Access field as proxy

* go to menu in left top corner, select `Dashboards`->`Import` and import dashboard from `./grafana/Beer Store Metrics.json`
* enjoy Beer Store!

#### Destroy environment
In order to remove all of the resource from minikube run next commands:

```
kubectl delete -f k8s/beerstore.yml
kubectl delete -f k8s/beerfans.yml
kubectl delete -f k8s/prometheus.yml
kubectl delete -f k8s/grafana.yml
```