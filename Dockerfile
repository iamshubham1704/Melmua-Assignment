# Build stage
FROM golang:1.21-alpine AS builder

# Install OpenCV dependencies
RUN apk add --no-cache \
    build-base \
    cmake \
    pkgconfig \
    libjpeg-turbo-dev \
    libpng-dev \
    libwebp-dev \
    openblas-dev \
    lapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    libxvidcore-dev \
    libx264-dev \
    libgtk-3-dev \
    libatlas-base-dev \
    gfortran \
    wget \
    unzip

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache \
    libjpeg-turbo \
    libpng \
    libwebp \
    openblas \
    lapack \
    libx11 \
    gtk+3.0 \
    libavcodec \
    libavformat \
    libswscale \
    libv4l \
    libxvidcore \
    libx264 \
    libtiff \
    libatlas \
    ca-certificates

# Create app directory
WORKDIR /app

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Copy OpenCV cascade files
COPY --from=builder /usr/share/opencv4/haarcascades/haarcascade_frontalface_alt.xml .

# Create uploads directory
RUN mkdir -p uploads/results

# Expose port
EXPOSE 8080

# Run the application
CMD ["./main"]

