export interface SystemHealth {
  status: string;
  environment: string;
  activeTenant: string;
  uptimeSeconds: number;
  components: {
    database: { status: string; routingMode: string };
    redisCache: { status: string; distributedLock: string };
    kafkaEventBus: { status: string; eventPipeline: string };
    circuitBreakers: { paymentService: string; meetingService: string; notificationService: string };
  };
  timestamp: string;
}
