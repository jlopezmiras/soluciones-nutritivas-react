from sqlalchemy import Column, Integer, String, Float
from database import Base


class Irrigation_Water_DB(Base):
    __tablename__ = "aguas_de_riego"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    date = Column(String, nullable=True)
    description = Column(String, nullable=True)

    nitrato     = Column(Float, default=0.0)
    fosforo     = Column(Float, default=0.0)
    sulfato     = Column(Float, default=0.0)
    bicarbonato = Column(Float, default=0.0)
    carbonato   = Column(Float, default=0.0)
    cloruro     = Column(Float, default=0.0)
    sodio       = Column(Float, default=0.0)
    calcio      = Column(Float, default=0.0)
    magnesio    = Column(Float, default=0.0)
    potasio     = Column(Float, default=0.0)
    amonio      = Column(Float, default=0.0)

    ph           = Column(Float, default=0.0)
    conductivity = Column(Float, default=0.0)


class Fertilizer_DB(Base):
    __tablename__ = "abonos"

    id    = Column(Integer, primary_key=True, index=True)
    name  = Column(String, unique=True, index=True)
    state = Column(String, default="s")  # s = solid, l = liquid

    r_n_nitrico   = Column(Float, default=0.0)
    r_fosforo_ox  = Column(Float, default=0.0)
    r_fosforo     = Column(Float, default=0.0)
    r_azufre_ox   = Column(Float, default=0.0)
    r_azufre      = Column(Float, default=0.0)
    r_cloro       = Column(Float, default=0.0)
    r_n_amoniacal = Column(Float, default=0.0)
    r_potasio_ox  = Column(Float, default=0.0)
    r_potasio     = Column(Float, default=0.0)
    r_calcio_ox   = Column(Float, default=0.0)
    r_calcio      = Column(Float, default=0.0)
    r_magnesio_ox = Column(Float, default=0.0)
    r_magnesio    = Column(Float, default=0.0)
    r_hidrogenion = Column(Float, default=0.0)
    r_n_ureico    = Column(Float, default=0.0)

    nitrato     = Column(Float, default=0.0)
    fosforo     = Column(Float, default=0.0)
    sulfato     = Column(Float, default=0.0)
    bicarbonato = Column(Float, default=0.0)
    carbonato   = Column(Float, default=0.0)
    cloruro     = Column(Float, default=0.0)
    sodio       = Column(Float, default=0.0)
    calcio      = Column(Float, default=0.0)
    magnesio    = Column(Float, default=0.0)
    potasio     = Column(Float, default=0.0)
    amonio      = Column(Float, default=0.0)

    ph           = Column(Float, default=0.0)
    conductivity = Column(Float, default=0.0)
