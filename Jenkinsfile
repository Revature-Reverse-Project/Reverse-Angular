pipeline {
  environment {
    registry = '' // TO UPDATE - Using Google Artifact Registry API
    dockerHubCreds = 'docker_hub' // TO CHANGE - Using Google Artifact Registry API
    dockerImage = '' // TO UPDATE - Using Google Artifact Registry API
  }
  agent any
  stages {
    stage('Unit Testing') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'}
        }
        steps {
            echo 'Unit Testing stage'
            // TO UPDATE - NOT MAVEN, TESTING?
            // withMaven {
            //     sh 'mvn test'
            // }
            // junit skipPublishingChecks: true, testResults: 'target/surefire-reports/*.xml'
        }
    }
    stage('Build') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            echo 'Build stage'
            // TO UPDATE - NOT MAVEN
            // withMaven {
            //     sh 'mvn package -DskipTests'
            // }
        }
    }
    stage('Docker Image') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script {
                echo 'Docker Image stage'
                //sh "docker build -t project3 ."
                // dockerImage = docker.build "$registry:$currentBuild.number"
            }
        }
    }
    stage('Docker Deliver to Artifact Registry') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script{
                echo 'Docker Deliver to Artifact Registry stage'
                 sh "docker tag project3 us-central1-docker.pkg.dev/devopssre-346918/project-3/project3"
                 sh "docker push us-central1-docker.pkg.dev/devopssre-346918/project-3/project3"
                //     dockerImage.push("latest")
                }
        }
    }
    stage('Wait for approval') {
        when {
            // branch 'master'
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
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps {
            echo 'Deploy stage'
            // sh 'sed -i "s/%TAG%/$BUILD_NUMBER/g" ./k8s/recipe-api.deployment.yaml'  // TO UPDATE
            // step([$class: 'KubernetesEngineBuilder',
            //     projectId: 'project2-350217',  // TO UPDATE
            //     clusterName: 'my-first-cluster-1', // TO UPDATE
            //     zone: 'us-central1-c', // TO CONFIRM
            //     manifestPattern: 'k8s/', // TO CONFIRM
            //     credentialsId: 'project2', // TO UPDATE
            //     verifyDeployments: true
            // ])

            // cleanWs();
        }
    }
  }
}