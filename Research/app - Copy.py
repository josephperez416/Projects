
from copy import copy
import io
import os
import sys
import time

import streamlit as st
import cv2 
import keras
import numpy as np
import urllib.request

from keras.layers import (Activation, Conv2D, Dense, Flatten,
                          GlobalAveragePooling2D, Input, MaxPooling2D, Dropout)
from keras.models import Model, Sequential
from keras.optimizers import Adam
# from tensorflow.keras.optimizers.legacy import Adam

from PIL import Image, ImageFile
# from sklearn.model_selection import train_test_split

from keras.preprocessing.image import ImageDataGenerator

train_dir = '/Users/josep/Documents/emocrec/Training'
val_dir = '/Users/josep/Documents/emocrec/Testing'

batch_size = 64
num_epoch = 50

datagen = ImageDataGenerator(rescale=1./255)

train_generator = datagen.flow_from_directory(
        train_dir,
        target_size=(48,48),
        batch_size=batch_size,
        color_mode="grayscale",
        class_mode='categorical')

validation_generator = datagen.flow_from_directory(
        val_dir,
        target_size=(48,48),
        batch_size=batch_size,
        color_mode="grayscale",
        class_mode='categorical')

def build_model(input_shape):
    model = Sequential()
    # Convolutional layer with 32 filters, each 3x3 in size
    model.add(Conv2D(32, (3, 3), activation='relu', input_shape=input_shape))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Convolutional layer with 64 filters, each 3x3 in size
    model.add(Conv2D(64, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Convolutional layer with 128 filters, each 3x3 in size
    model.add(Conv2D(128, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Convolutional layer with 264 filters, each 3x3 in size
    model.add(Conv2D(264, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Try to experiment with the following two lines uncomment one and comment out the other to see the differences in performance
    # model.add(Flatten())  # Flatten the 3D output to 1D
    model.add(GlobalAveragePooling2D())

    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))

    # Output layer with 1 neuron (since it's binary classification with Happy-1 and Sad-0)
    # model.add(Dense(1, activation='sigmoid'))
    model.add(Dense(6, activation='softmax'))

    return model


input_shape = (48,48, 1)
model = build_model(input_shape)


model.compile(loss='categorical_crossentropy',optimizer=Adam(),metrics=['accuracy'])
reduce_lr = keras.callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2,
                              patience=5, min_lr=0.001)


model.load_weights('model1.h5')

face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
emotion_dict = {0: "Angry", 1: "Fear", 2: "Happy", 3: "Neutral", 4: "Sad", 5: "Surprised"}


st.header("Emotion Recognition System")

img = None

option = st.selectbox(
   "Choose a method for uploading images:",
   ("From URL", "From Computer", "From Camera"),
   index=None,
   placeholder="Select a method...",
)

if(option=="From URL"):
    img_URL = st.text_input('Enter a URL:')
    
    if img_URL:
        req = urllib.request.Request(
            img_URL, 
            data=None, 
            headers={
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
        })

        url_response = urllib.request.urlopen(req)
        o_img = Image.open(url_response)
        o_img = np.array(o_img)
        img = copy(o_img)
if(option=="From Camera"):
    cam = cv2.VideoCapture(0)
    cv2.namedWindow("test")
    img_counter = 0
    o_img = None
    while True:
        ret, frame = cam.read()
        if not ret:
            print("failed to grab frame")
            break
        cv2.imshow("test", frame)
        k = cv2.waitKey(1)
        if k%256 == 32:
            # SPACE pressed
            img_name = "opencv_frame_{}.png".format(img_counter)
            o_img = img_name
            cv2.imwrite(img_name, frame)
            print("{} written!".format(img_name))
            break
    o_img = Image.open(o_img)
    o_img = np.array(o_img)
    img = o_img

    cam.release()
    cv2.destroyAllWindows()
     
if(option=="From Computer"):
    uploaded_img = st.file_uploader('Choose an image', type=['jpg', 'png'])
    if uploaded_img:
        o_img = Image.open(uploaded_img)
        o_img = np.array(o_img)
        img = copy(o_img)

if img is not None:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_classifier.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(40, 40))

    for (x, y, w, h) in faces:
        cv2.rectangle(o_img, (x, y), (x + w, y + h), (0, 255, 0), 4)
        roi_gray = gray[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray, (48, 48)), -1), 0)
        prediction = model.predict(cropped_img)
        maxindex = int(np.argmax(prediction))
        cv2.putText(o_img, emotion_dict[maxindex], (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2, cv2.LINE_AA)

    st.image(o_img)
