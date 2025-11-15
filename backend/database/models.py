from sqlite3 import Date
from sqlalchemy import JSON, Column, ForeignKey, Integer, String, Float, create_engine
from sqlalchemy.orm import relationship, sessionmaker
from datetime import date
from database.database import Base


class Irrigation_Water_DB(Base):
    __tablename__ = "aguas_de_riego"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    date = Column(String, nullable=True)
    description = Column(String, nullable=True)

    no3     = Column(Float, default=0.0)
    h2po4     = Column(Float, default=0.0)
    so4     = Column(Float, default=0.0)
    hco3 = Column(Float, default=0.0)
    cl     = Column(Float, default=0.0)
    na       = Column(Float, default=0.0)
    ca      = Column(Float, default=0.0)
    mg    = Column(Float, default=0.0)
    k     = Column(Float, default=0.0)
    nh4      = Column(Float, default=0.0)

    ph           = Column(Float, default=0.0)
    conductivity = Column(Float, default=0.0)

    # Original entry from the user, for reference
    raw_input = Column(JSON, nullable=True)


class Fertilizer_DB(Base):
    __tablename__ = "abonos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    date = Column(String, nullable=True)
    description = Column(String, nullable=True)

    state = Column(String, default="s")  # s = solid, l = liquid
    density = Column(Float, default=0.0)  # g/ml for liquids

    no3     = Column(Float, default=0.0)
    h2po4     = Column(Float, default=0.0)
    so4     = Column(Float, default=0.0)
    hco3 = Column(Float, default=0.0)
    cl     = Column(Float, default=0.0)
    na       = Column(Float, default=0.0)
    ca      = Column(Float, default=0.0)
    mg    = Column(Float, default=0.0)
    k     = Column(Float, default=0.0)
    nh4      = Column(Float, default=0.0)

    # Original entry from the user, for reference
    raw_input = Column(JSON, nullable=True)




