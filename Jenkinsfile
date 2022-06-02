pipeline {
  environment {
    registry = '' // TO UPDATE - Using Google Artifact Registry API
    dockerHubCreds = 'docker_hub' // TO CHANGE - Using Google Artifact Registry API
    dockerImage = '' // TO UPDATE - Using Google Artifact Registry API
  }
  agent any
  stages {
    stage('Quality Gate') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'}
        }
        steps {
            container('SonarQubeScanner') {
                withSonarQubeEnv('SonarQube') {
                    sh //path-to-sonar-scanner
                }
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
    stage('Unit Testing') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'}
            // branch 'ft_jenkins'
        }
        steps {
            // TO UPDATE - NOT MAVEN, TESTING?
            // withMaven {
            //     sh 'mvn test'
            // }
            // junit skipPublishingChecks: true, testResults: 'target/surefire-reports/*.xml'
        }
    }
    stage('Build') {
        when {
            // branch 'main'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            // TO UPDATE - NOT MAVEN
            // withMaven {
            //     sh 'mvn package -DskipTests'
            // }
        }
    }
    stage('Docker Image') {
        when {
            // branch 'main'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script {
                echo "$registry:$currentBuild.number"
                dockerImage = docker.build "$registry:$currentBuild.number"
            }
        }
    }
    stage('Docker Deliver') {
        when {
            // branch 'main'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script{
                docker.withRegistry("", dockerHubCreds) {
                    dockerImage.push("$currentBuild.number")
                    dockerImage.push("latest")
                }
            }
        }
    }
    stage('Wait for approval') {
        when {
            // branch 'main'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps {
            script {
            try {
                timeout(time: 20, unit: 'MINUTES') {
                    approved = input message: 'Deploy to production?', ok: 'Continue',
                        parameters: [choice(name: 'approved', choices: 'Yes\nNo', description: 'Deploy build to production')]

                    if(approved != 'Yes') {
                        error('Build did not pass approval')
                    }
                }
            } catch(error) {
                error('Build failed because timeout was exceeded');
            }
        }
        }
    }
    stage('Deploy') {
        when {
            // branch 'main'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps {
            sh 'sed -i "s/%TAG%/$BUILD_NUMBER/g" ./k8s/recipe-api.deployment.yaml'  // TO UPDATE
            step([$class: 'KubernetesEngineBuilder',
                projectId: 'project2-350217',  // TO UPDATE
                clusterName: 'my-first-cluster-1', // TO UPDATE
                zone: 'us-central1-c', // TO CONFIRM
                manifestPattern: 'k8s/', // TO CONFIRM
                credentialsId: 'project2', // TO UPDATE
                verifyDeployments: true
            ])

            cleanWs();
        }
    }
  }
}