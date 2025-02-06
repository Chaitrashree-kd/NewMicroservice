pipeline {
    agent any
    environment {
        BACKEND_IMAGE = 'backend'
        FRONTEND_IMAGE = 'frontend'
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/Chaitrashree-kd/NewMicroservice.git'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    script {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    script {
                        sh 'docker build -t $BACKEND_IMAGE .'
                    }
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend') {
                    script {
                        sh 'docker build -t $FRONTEND_IMAGE .'
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    sh 'docker push $BACKEND_IMAGE'
                    sh 'docker push $FRONTEND_IMAGE'
                }
            }
        }
    }
}
