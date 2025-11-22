import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, create_engine, text

app = FastAPI(title="Samriddhi API")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/samriddhi_dev")
engine = create_engine(DATABASE_URL)


@app.get("/")
def read_root():
    return {"message": "Samriddhi API is running"}


@app.get("/api/health")
def health_check():
    """Health check endpoint that verifies database connectivity."""
    try:
        with Session(engine) as session:
            # Create test table if it doesn't exist
            session.exec(text("""
                CREATE TABLE IF NOT EXISTS health_check (
                    id SERIAL PRIMARY KEY,
                    message TEXT NOT NULL,
                    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            session.commit()
            
            # Insert a test record
            session.exec(text("""
                INSERT INTO health_check (message) 
                VALUES ('Hello from Samriddhi!')
            """))
            session.commit()
            
            # Retrieve the latest record
            result = session.exec(text("""
                SELECT message, checked_at 
                FROM health_check 
                ORDER BY checked_at DESC 
                LIMIT 1
            """))
            row = result.first()
            
            return {
                "status": "healthy",
                "database": "connected",
                "message": row[0] if row else "No data",
                "timestamp": str(row[1]) if row else None
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
