FROM python:alpine

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY super_chipher.py .

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "super_chipher:app"]
