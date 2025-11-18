'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setStatus('Please enter a description');
      return;
    }

    setIsLoading(true);
    setStatus('Creating your dream... ✨');
    setImageUrl('');

    try {
      // Create the prediction
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      let prediction = await response.json();
      
      if (response.status !== 201) {
        setStatus('Failed to start generation. Please try again.');
        setIsLoading(false);
        return;
      }

      // Poll for the result
      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const pollResponse = await fetch(`/api/predictions/${prediction.id}`);
        prediction = await pollResponse.json();
        
        if (pollResponse.status !== 200) {
          setStatus('Error checking status. Please try again.');
          setIsLoading(false);
          return;
        }
      }

      if (prediction.status === "succeeded") {
        setImageUrl(prediction.output[0]);
        setStatus('Dream created successfully! ✨');
      } else {
        setStatus('Failed to generate image. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.icon}>✨</span>
          <span>
            Dream something with{' '}
            <a 
              href="https://blackforestlabs.ai/" 
              className={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Flux Schnell
            </a>
          </span>
        </h1>
        <p className={styles.subtitle}>
          Turn your imagination into reality with AI-powered image generation
        </p>
      </div>

      {/* Input Card */}
      <div className={styles.inputCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your dream... (e.g., a magical forest at sunset)"
            disabled={isLoading}
          />
          <button 
            className={styles.button} 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className={styles.spinner}></span>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span className={styles.buttonIcon}>✨</span>
                <span>Generate Dream</span>
                <span className={styles.buttonIcon}>✨</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Image Display */}
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img 
            className={styles.image} 
            src={imageUrl} 
            alt="AI Generated Dream" 
          />
        </div>
      )}

      {/* Status Message */}
      {status && (
        <div className={styles.status}>
          {status}
        </div>
      )}
    </div>
  );
}