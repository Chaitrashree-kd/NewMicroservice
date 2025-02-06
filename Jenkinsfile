pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'backend'.toLowerCase() // Docker image name in lowercase
        REGISTRY = 'icr.io/ci-cd-app'
        REGISTRY_URL = "us.icr.io"
        NAMESPACE = "ci-cd-app"
        IMAGE_NAME = "backend" // Docker image for backend
        TAG = "latest"
        DOCKER_CLI = "docker"
        IBM_CLOUD_CLI = "ibmcloud"
        KUBECONFIG = 'C:/Users/HP/.kube/config' // Minikube kubeconfig path
    }
    stages {
        // Checkout code from GitHub repository
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        // Install dependencies (npm install for backend)
        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'
                }
            }
        }
        // Run tests
        stage('Run Tests') {
            steps {
                script {
                    bat 'npm test'
                }
            }
        }
        // Build application
        stage('Build Application') {
            steps {
                script {
                    bat 'npm run build'
                }
            }
        }
        // Build Docker Image for Backend
        stage('Build Docker Image') {
            steps {
                bat '''
                    echo Building Docker image...
                    docker build -t %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG% .
                '''
            }
        }
        // Install IBM Cloud Container Registry plugin
        stage('Install IBM Cloud Container Registry Plugin') {
            steps {
                script {
                    echo 'Checking if IBM Cloud Container Registry plugin is installed...'
                    def pluginList = bat(script: "ibmcloud plugin list", returnStdout: true).trim()
                    if (!pluginList.contains('container-registry')) {
                        echo 'IBM Cloud Container Registry plugin not found. Installing plugin...'
                        bat 'ibmcloud plugin install container-registry -f'
                    } else {
                        echo 'IBM Cloud Container Registry plugin is already installed.'
                    }
                }
            }
        }
        // Push Docker image to IBM Cloud
        stage('Push Docker Image to IBM Cloud Registry') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'ibm-cloud-api-key', variable: 'IBM_API_KEY')]) {
                        echo 'Logging into IBM Cloud...'
                        bat """
                            ibmcloud login --apikey %IBM_API_KEY% --no-region
                            ibmcloud cr login
                        """
                    }
                    echo 'Pushing Docker image to IBM Cloud Container Registry...'
                    bat '''
                        docker push %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG%
                    '''
                }
            }
        }
        // Deploy to Minikube
        stage('Deploy to Minikube') {
            steps {
                script {
                    echo 'Deploying to Minikube...'
                    bat '''
                        kubectl config use-context minikube
                    '''
                    bat """
                        kubectl apply -f k8s/backend-deployment.yaml
                    """
                    echo 'Deployment to Minikube complete!'
                    bat '''
                        kubectl get pods
                    '''
                }
            }
        }
        // Deploy to IBM Cloud
        stage('Deploy to IBM Cloud') {
            steps {
                script {
                    if (fileExists('k8s/backend-deployment.yaml')) {
                        echo 'Deploying to IBM Cloud...'
                        bat '''
                            kubectl apply -f k8s/backend-deployment.yaml
                        '''
                        echo 'Deployment to IBM Cloud complete!'
                    } else {
                        echo 'Deployment file not found. Skipping deployment.'
                    }
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up Docker images...'
            bat '''
                docker system prune -f
            '''
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
}
}
}
