import geoip2.database
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

load_dotenv()

GEOIP_DATABASE_PATH = os.getenv("GEOIP_DATABASE_PATH")

logger.info(f"GeoIP Database Path from env: {GEOIP_DATABASE_PATH}")

def get_geoip_data(ip_address: str):
    logger.info(f"Looking up GeoIP for IP: {ip_address}")
    if not GEOIP_DATABASE_PATH:
        logger.warning("GEOIP_DATABASE_PATH is not set.")
        return None
    if not os.path.exists(GEOIP_DATABASE_PATH):
        logger.warning(f"GeoIP database not found at path: {GEOIP_DATABASE_PATH}")
        return None
    try:
        with geoip2.database.Reader(GEOIP_DATABASE_PATH) as reader:
            response = reader.city(ip_address)
            data = {
                "country_code": response.country.iso_code,
                "country_name": response.country.name,
                "city": response.city.name,
                "latitude": float(response.location.latitude),
                "longitude": float(response.location.longitude),
            }
            logger.info(f"GeoIP data found for {ip_address}: {data}")
            return data
    except geoip2.errors.AddressNotFoundError:
        logger.warning(f"Address {ip_address} not found in GeoIP database. This is expected for local/private IPs.")
        return None
    except Exception as e:
        logger.error(f"An unexpected error occurred during GeoIP lookup: {e}", exc_info=True)
        return None 