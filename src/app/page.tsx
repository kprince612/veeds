"use client";

import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { handleError, handleSuccess } from "../utils";
import { ToastContainer } from "react-toastify";
import {
  Button,
  NumberInput,
  FileInput,
  Text,
  Paper,
  Title,
  Divider,
} from "@mantine/core";

export default function Home() {
  const [mediaList, setMediaList] = useState([]);
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handleMediaUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newMedia = Array.from(files).map((file) => ({
        id: Date.now() + Math.random(),
        type: file.type.startsWith("video") ? "video" : "image",
        src: URL.createObjectURL(file),
        width: 200,
        height: 150,
        x: 50,
        y: 50,
        startTime: 0,
        endTime: 5,
      }));

      setMediaList((prev) => [...prev, ...newMedia]);
      handleSuccess("Files uploaded successfully.");
    } else {
      handleError("No file selected or invalid file.");
    }
  };

  const handlePlay = () => {
    if (playing) {
      clearInterval (intervalRef.current);
      setPlaying (false);
    }

    else {
      setPlaying (true);
    }
  };

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => {
          const maxEnd = Math.max(...mediaList.map((m) => m.endTime || 0));
          if (prev >= maxEnd) {
            clearInterval(intervalRef.current);
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, mediaList]);

  const updateMedia = (id, updatedFields) => {
    setMediaList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  return (
    <main style={{ display: "flex", height: "100vh", background: "#f9fafb" }}>
      <Paper
        shadow="md"
        p="md"
        style={{
          width: 300,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          borderRight: "1px solid #ddd",
          background: "#fff",
          overflowY: "auto",
        }}
      >
        <Title order={4}>Add Images/Videos</Title>
        <FileInput
          label="Upload Media"
          accept="video/*,image/*"
          multiple
          onChange={handleMediaUpload}
        />
        <Divider my="sm" />
        {mediaList.map((media, index) => (
          <Paper key={media.id} p="sm" shadow="xs" style={{ background: "#f8f8f8" }}>
            <Title order={6}>Media {index + 1}</Title>
            <NumberInput
              label="Width"
              value={media.width}
              onChange={(value) => updateMedia(media.id, { width: value })}
            />
            <NumberInput
              label="Height"
              value={media.height}
              onChange={(value) => updateMedia(media.id, { height: value })}
            />
            <NumberInput
              label="Start Time (s)"
              value={media.startTime}
              onChange={(value) => updateMedia(media.id, { startTime: value })}
            />
            <NumberInput
              label="End Time (s)"
              value={media.endTime}
              onChange={(value) => updateMedia(media.id, { endTime: value })}
            />
          </Paper>
        ))}
      </Paper>

      <div
        style={{
          flex: 1,
          position: "relative",
          background: "#000000",
          opacity: 0.9,
        }}
      >
        {mediaList.map((media) => {
          const isVisible = timer >= media.startTime && timer < media.endTime;
          return (
            isVisible && (
              <Rnd
                key={media.id}
                size={{ width: media.width, height: media.height }}
                position={{ x: media.x, y: media.y }}
                onDragStop={(e, d) =>
                  updateMedia(media.id, { x: d.x, y: d.y })
                }
                onResizeStop={(e, direction, ref, delta, position) =>
                  updateMedia(media.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  })
                }
                bounds="parent"
              >
                {media.type === "image" ? (
                  <img
                    src={media.src}
                    style={{ width: "100%", height: "100%" }}
                    alt="Uploaded"
                  />
                ) : (
                  <video
                    src={media.src}
                    style={{ width: "100%", height: "100%" }}
                    controls
                  />
                )}
              </Rnd>
            )
          );
        })}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "15%",
            width: "100%",
            background: "#ffffff",
            padding: "10px 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
            borderTop: "1px solid #ddd",
          }}
        >
          {mediaList.length > 0 && (
            <>
              <Button onClick={handlePlay}>
                { playing ? '⏸️ Pause' : '▶️ Play'}
                </Button>
              <Text>⏱ {timer}s</Text>
            </>
          )}
        </div>

        <ToastContainer />
      </div>
    </main>
  );
}
