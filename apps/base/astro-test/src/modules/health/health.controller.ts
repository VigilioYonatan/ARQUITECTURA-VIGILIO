import { CacheService } from "@infrastructure/providers/cache/cache.service";
import { RustFSService } from "@infrastructure/providers/storage/rustfs.service";
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
} from "@nestjs/terminus";

/**
 * Health Controller - Senior Level Implementation
 *
 * Provides health check endpoints for:
 * - Kubernetes liveness/readiness probes
 * - Load balancer health checks
 * - Monitoring systems (Prometheus, Datadog, etc.)
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private memory: MemoryHealthIndicator,
        private cacheService: CacheService,
        private rustfsService: RustFSService
    ) {}

    /**
     * Basic liveness probe - checks if the app is running
     */
    @Get()
    @ApiOperation({ summary: "Basic health check" })
    @ApiResponse({ status: 200, description: "Service is healthy" })
    check() {
        return { status: "ok", timestamp: new Date().toISOString() };
    }

    /**
     * Detailed health check with all indicators (DB, Redis, S3, Memory)
     */
    @Get("detailed")
    @HealthCheck()
    @ApiOperation({ summary: "Detailed health check with all indicators" })
    @ApiResponse({ status: 200, description: "All health indicators" })
    checkDetailed() {
        return this.health.check([
            // 1. Memory Check
            () => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
            () => this.memory.checkHeap("memory_heap", 200 * 1024 * 1024),

            // 2. Redis Check using CacheService
            async () => {
                const isHealthy = await this.cacheService.checkHealth();
                if (!isHealthy) {
                    throw new Error("Redis connection failed");
                }
                return {
                    redis: {
                        status: "up",
                    },
                };
            },

            // 3. S3 (RustFS) Check
            async () => {
                const isHealthy = await this.rustfsService.checkHealth();
                if (!isHealthy) {
                    throw new Error("S3 object storage unreachable");
                }
                return {
                    s3_storage: {
                        status: "up",
                    },
                };
            },
        ]);
    }

    /**
     * Readiness probe - checks if the app is ready to receive traffic
     */
    @Get("ready")
    @ApiOperation({ summary: "Readiness probe for Kubernetes" })
    @ApiResponse({ status: 200, description: "Service is ready" })
    async readiness() {
        // En readiness verificamos conexiones críticas
        const redis = await this.cacheService.checkHealth();
        // S3 es opcional para arrancar si no es crítico, pero recomendable
        const s3 = await this.rustfsService.checkHealth();

        if (!redis) {
            // Service Unavailable
            throw new Error("Critical services are not ready");
        }

        return {
            status: "ready",
            services: {
                redis: redis ? "up" : "down",
                s3: s3 ? "up" : "down",
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    /**
     * Liveness probe - checks if the app should be restarted
     */
    @Get("live")
    @ApiOperation({ summary: "Liveness probe for Kubernetes" })
    @ApiResponse({ status: 200, description: "Service is alive" })
    liveness() {
        return {
            status: "alive",
            timestamp: new Date().toISOString(),
            pid: process.pid,
        };
    }
}
