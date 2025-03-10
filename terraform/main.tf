provider "aws" {
    region = "ap-southeast-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0df7a207adb9748c7"
  instance_type = "t2.micro"

  tags = {
    Name = "Frontend-Test-Server"
  }

  vpc_security_group_ids = [aws_security_group.allow_http.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
              sudo yum install -y nodejs npm
              sudo yum install git
              git clone https://github.com/alitonia/singgov-assessment.git
              cd singgov-assessment
              npm ci
              npm run build
              PORT=80 npm run start
              EOF
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP inbound traffic"

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_http"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}